# batchRequestsOf 함수

중복 호출을 방지하는 함수입니다.

### 사용 예시

3초 내에 버튼을 몇 번을 클릭해도 api는 한 번만 호출됩니다.

```tsx
function App() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {}, []);

  const addTodos = batchRequestsOf(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) => setData((prev) => [...prev, ...data]));
  });

  const handleClick = () => {
    addTodos();
  };

  return (
    <>
      <h1>length: {data.length}</h1>
      <button onClick={handleClick}>ADD</button>
    </>
  );
}
```

### 주의사항

api 호출 응답이 매우 빠른 경우에는 중복호출을 막지 못하는 경우가 발생합니다.  
쓰로틀링, 디바운싱과 함께 사용해주시거나, `flushSync` api와 함께 사용하여 상호보완하시면 좋을 것 같습니다.

### 출처

- https://www.xionwcfm.com/posts/frontend/single-flight
- https://happysisyphe.tistory.com/72
