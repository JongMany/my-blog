import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as THREE from "three";
import { cn } from "../../utils/cn";

export interface ImageScanEffectProps {
  /**
   * 배경 이미지 URL
   */
  imageUrl?: string;
  /**
   * 깊이 맵 이미지 URL
   */
  depthMapUrl?: string;
  /**
   * 효과 타입
   */
  effectType?: "gradient" | "dots";
  /**
   * 효과 강도 (0.1 - 5)
   */
  intensity?: number;
  /**
   * 그라디언트 너비 (0 - 5)
   */
  gradientWidth?: number;
  /**
   * 도트 크기 (1 - 100)
   */
  dotSize?: number;
  /**
   * 도트 타일링 (1 - 100)
   */
  dotTiling?: number;
  /**
   * 효과 색상
   */
  effectColor?: string;
  /**
   * 배경 색상
   */
  backgroundColor?: string;
  /**
   * 애니메이션 재생 모드
   */
  animationMode?: "once" | "loop" | "hover";
  /**
   * 애니메이션 지속 시간 (초)
   */
  animationDuration?: number;
  /**
   * 호버 효과 활성화
   */
  hoverEnabled?: boolean;
  /**
   * 블룸 강도 (0 - 1)
   */
  bloomStrength?: number;
  /**
   * 블룸 반지름 (0.1 - 10)
   */
  bloomRadius?: number;
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
  /**
   * 추가 스타일
   */
  style?: React.CSSProperties;
}

/**
 * 이미지 스캔 효과 컴포넌트
 * Three.js와 WebGL을 사용하여 3D 스캔 효과를 구현합니다.
 */
export const ImageScanEffect: React.FC<ImageScanEffectProps> = ({
  imageUrl,
  depthMapUrl,
  effectType = "gradient",
  intensity = 1,
  gradientWidth = 3.5,
  dotSize = 50,
  dotTiling = 50,
  effectColor = "#ffffff",
  backgroundColor = "#000000",
  animationMode = "once",
  animationDuration = 3,
  hoverEnabled = true,
  bloomStrength = 0.3,
  bloomRadius = 5,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const animationRef = useRef<number>(null);

  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(16 / 9);

  // 색상 파싱
  const parseColor = useCallback((color: string) => {
    const hex = color.replace("#", "");
    return new THREE.Color(
      parseInt(hex.substr(0, 2), 16) / 255,
      parseInt(hex.substr(2, 2), 16) / 255,
      parseInt(hex.substr(4, 2), 16) / 255,
    );
  }, []);

  // 버텍스 셰이더
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // 프래그먼트 셰이더
  const fragmentShader = `
    uniform float uProgress;
    uniform sampler2D uDepthMap;
    uniform sampler2D uTextureMap;
    uniform vec3 uColor;
    uniform float uColorAlpha;
    uniform float uEffectType;
    uniform float uDotSize;
    uniform float uTilingScale;
    uniform float uGradientWidth;
    uniform float uIntensity;
    uniform float uBloomStrength;
    uniform float uBloomRadius;
    uniform float uAspectRatio;
    uniform bool uShowTexture;
    uniform vec3 uBackgroundColor;
    
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      float depth = texture2D(uDepthMap, uv).r;
      
      // Use the exact working formula from reference-code.tsx
      // Shift the band backward by one full gradient width so that
      // pixels at exact progress start invisible and end not stuck at 1.0
      // Base band width from control
      float baseWidth = uGradientWidth * 0.1;
      // Account for perceived widening from intensity and bloom
      float intensityFactor = max(uIntensity - 1.0, 0.0) * 0.15; // 0 when <=1, grows slowly
      float bloomFactor = uBloomStrength * (1.0 + uBloomRadius * 50.0); // radius expands halo
      float bandWidth = baseWidth * (1.0 + intensityFactor + bloomFactor);
      // Stretch progress farther (pre/overshoot) while keeping the local falloff shaped by bandWidth
      float overshootWidth = bandWidth * 2.2; // push more than the visual width
      float stretchedProgress = uProgress * (1.0 + 2.0 * overshootWidth) - overshootWidth;
      float flow = 1.0 - smoothstep(0.0, bandWidth, abs(depth - stretchedProgress));

      // Global progress envelope: fade in first 5% and fade out last 5%
      float startFade = smoothstep(0.0, 0.05, uProgress);
      float endFade = 1.0 - smoothstep(0.95, 1.0, uProgress);
      float progressEnvelope = startFade * endFade;
      
      // For dots effect - only render if explicitly in dots mode
      if (uEffectType < 0.5) {
        // Create tiled UV for dots using dynamic aspect ratio
        vec2 aspect = vec2(uAspectRatio, 1.0);
        vec2 tUv = vec2(uv.x * aspect.x, uv.y);
        vec2 tiling = vec2(uTilingScale);
        vec2 tiledUv = mod(tUv * tiling, 2.0) - 1.0;
        
        // Create dots with proper size control
        float dist = length(tiledUv);
        // Map uDotSize (approx 0.01..2.0) to a radius within the cell (0.08..0.48)
        float dotSize01 = clamp(uDotSize / 2.0, 0.0, 1.0);
        float dotRadius = mix(0.08, 0.48, dotSize01);
        float feather = 0.02;
        // Filled circle mask with soft edge
        float circle = 1.0 - smoothstep(dotRadius, dotRadius + feather, dist);
        
        // Shifted flow like gradient so initial band starts at 0 and overshoots
        float baseWidth = uGradientWidth * 0.1;
        float intensityFactor = max(uIntensity - 1.0, 0.0) * 0.15;
        float bloomFactor = uBloomStrength * (1.0 + uBloomRadius * 50.0);
        float bandWidth = baseWidth * (1.0 + intensityFactor + bloomFactor);
        float overshootWidth = bandWidth * 2.0;
        float stretchedProgress = uProgress * (1.0 + 2.0 * overshootWidth) - overshootWidth;
        float dotFlow = 1.0 - smoothstep(0.0, bandWidth, abs(depth - stretchedProgress));
        
        // Base dot effect
        float dotEffect = circle * dotFlow;
        
        // Apply bloom effect to dots
        float bloomSize = uBloomRadius * 100.0;
        float dotBloom = 0.0;
        
        // Core bloom for dots - use the same dot radius
        float coreBloom = circle * flow * uBloomStrength;
        // Medium bloom - extends from dot edge
        float mediumBloom = smoothstep(dotRadius + bloomSize * 0.3, dotRadius, dist) * flow * uBloomStrength * 0.6;
        // Outer bloom - largest area
        float outerBloom = smoothstep(dotRadius + bloomSize, dotRadius, dist) * flow * uBloomStrength * 0.3;
        
        dotBloom = max(max(coreBloom, mediumBloom), outerBloom);
        
        // Combine dot effect with bloom and apply intensity
        float final = max(dotEffect, dotBloom) * uIntensity;
        // Apply global progress envelope so effect is invisible at start and end
        final *= progressEnvelope;
        
        vec3 finalColor = uColor * final;
        float finalAlpha = final * uColorAlpha;
        
        // Background or texture
        if (uShowTexture) {
          vec4 textureColor = texture2D(uTextureMap, uv);
          finalColor = mix(textureColor.rgb, finalColor, finalAlpha);
          finalAlpha = max(textureColor.a, finalAlpha);
        } else {
          finalColor = mix(uBackgroundColor, finalColor, finalAlpha);
        }
        
        gl_FragColor = vec4(finalColor, finalAlpha);
      } else {
        // For gradient line effect - use same stretched band so edges start/end at 0
        float exactProgress = abs(depth - stretchedProgress);
        // Opacity fades from 1.0 at band center to 0.0 at one width away
        float opacity = 1.0 - smoothstep(0.0, bandWidth, exactProgress);
        
        // Intensity-based bloom effect - brighter areas create more bloom like reference code
        float bloomStrength = uBloomStrength;
        float bloomSize = uBloomRadius * 100.0; // Scale up for better control
        
        // Create multiple layers of bloom at different sizes for realistic glow
        float bloom = 0.0;
        
        // Core bloom - closest to the line
        float coreBloom = exactProgress <= (bandWidth + bloomSize * 0.5) ? 
            (1.0 - smoothstep(0.0, bandWidth + bloomSize * 0.5, exactProgress)) * bloomStrength : 0.0;
        
        // Medium bloom - extends further
        float mediumBloom = exactProgress <= (bandWidth + bloomSize) ? 
            (1.0 - smoothstep(0.0, bandWidth + bloomSize, exactProgress)) * bloomStrength * 0.6 : 0.0;
        
        // Outer bloom - softest and widest
        float outerBloom = exactProgress <= (bandWidth + bloomSize * 2.0) ? 
            (1.0 - smoothstep(0.0, bandWidth + bloomSize * 2.0, exactProgress)) * bloomStrength * 0.3 : 0.0;
        
        // Combine all bloom layers
        bloom = max(max(coreBloom, mediumBloom), outerBloom);
        
        // Intensity-based boost - stronger intensity creates more bloom
        float intensityBoost = uIntensity * 0.5;
        bloom *= (1.0 + intensityBoost);
        
        // Combine main line with bloom
        float finalOpacity = max(opacity, bloom);
        // Apply global progress envelope so effect is invisible at start and end
        finalOpacity *= progressEnvelope;
        
        // Apply color and intensity
        vec3 finalColor = uColor * finalOpacity * uIntensity;
        float finalAlpha = finalOpacity * uColorAlpha;
        
        // Background or texture
        if (uShowTexture) {
          vec4 textureColor = texture2D(uTextureMap, uv);
          finalColor = mix(textureColor.rgb, finalColor, finalAlpha);
          finalAlpha = max(textureColor.a, finalAlpha);
        } else {
          finalColor = mix(uBackgroundColor, finalColor, finalAlpha);
        }
        
        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    }
  `;

  // Three.js 씬 초기화
  const initThreeJS = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 씬 생성
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 카메라 생성
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    // 렌더러 생성
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 셰이더 머티리얼 생성
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uDepthMap: { value: null },
        uTextureMap: { value: null },
        uColor: { value: parseColor(effectColor) },
        uColorAlpha: { value: 1 },
        uEffectType: { value: effectType === "dots" ? 0 : 1 },
        uDotSize: { value: dotSize / 50 },
        uTilingScale: { value: dotTiling * 2 },
        uGradientWidth: { value: gradientWidth / 10 },
        uIntensity: { value: intensity },
        uBloomStrength: { value: bloomStrength },
        uBloomRadius: { value: bloomRadius / 1000 },
        uAspectRatio: { value: imageAspectRatio },
        uShowTexture: { value: !!imageUrl },
        uBackgroundColor: { value: parseColor(backgroundColor) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    // 평면 지오메트리 생성
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 텍스처 로드
    const loadTextures = async () => {
      const loader = new THREE.TextureLoader();

      // 깊이 맵 로드
      const depthTexture = depthMapUrl
        ? await loader.loadAsync(depthMapUrl)
        : createDefaultDepthTexture();

      // 배경 텍스처 로드
      const textureMap = imageUrl ? await loader.loadAsync(imageUrl) : null;

      if (materialRef.current) {
        materialRef.current.uniforms.uDepthMap.value = depthTexture;
        if (textureMap) {
          materialRef.current.uniforms.uTextureMap.value = textureMap;
        }
      }

      setIsLoaded(true);
    };

    loadTextures();

    // 렌더 루프
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (materialRef.current) {
        materialRef.current.uniforms.uProgress.value = progress;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeChild(renderer.domElement);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, [
    effectColor,
    effectType,
    dotSize,
    dotTiling,
    gradientWidth,
    intensity,
    bloomStrength,
    bloomRadius,
    imageAspectRatio,
    backgroundColor,
    imageUrl,
    depthMapUrl,
    progress,
    parseColor,
  ]);

  // 기본 깊이 텍스처 생성
  const createDefaultDepthTexture = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const imageData = ctx.createImageData(512, 512);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const y = Math.floor(i / 4 / 512);
        const normalizedY = y / 512;
        const depth = Math.sin(normalizedY * Math.PI) * 0.5 + 0.5;

        data[i] = depth * 255; // R
        data[i + 1] = depth * 255; // G
        data[i + 2] = depth * 255; // B
        data[i + 3] = 255; // A
      }

      ctx.putImageData(imageData, 0, 0);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // 이미지 종횡비 계산
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      setImageAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Three.js 초기화
  useEffect(() => {
    const cleanup = initThreeJS();
    return cleanup;
  }, [initThreeJS]);

  // 애니메이션 루프
  const animate = useCallback(() => {
    if (animationMode === "hover" && !isHovering) return;

    setProgress((prev) => {
      const newProgress = prev + 1 / (animationDuration * 60);
      if (newProgress >= 1) {
        if (animationMode === "loop") {
          return 0;
        } else if (animationMode === "once") {
          return 1;
        }
      }
      return newProgress;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [animationMode, animationDuration, isHovering]);

  // 애니메이션 시작/중지
  useEffect(() => {
    if (animationMode === "hover") {
      if (isHovering) {
        animate();
      } else {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    } else {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, animationMode, isHovering]);

  // 마우스 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hoverEnabled || animationMode !== "hover") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relativeY = (e.clientY - rect.top) / rect.height;
    setProgress(Math.max(0, Math.min(1, relativeY)));
  };

  const handleMouseEnter = () => {
    if (hoverEnabled && animationMode === "hover") {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverEnabled && animationMode === "hover") {
      setIsHovering(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: backgroundColor }}
        >
          <div className="text-white/50">Loading...</div>
        </div>
      )}
    </div>
  );
};

ImageScanEffect.displayName = "ImageScanEffect";
