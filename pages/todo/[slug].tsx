import { Todo } from '@/interfaces';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export default function DetailTodo() {
  const [currentTodo, setCurrentTodo] = useState<Todo>();
  const router = useRouter();
  const { slug } = router.query;
  useEffect(() => {
    const list = localStorage.getItem('todoList');
    if (list) {
      const listTodo: Todo[] = JSON.parse(list);
      const findTodo = listTodo.find((x) => x.name === slug);
      setCurrentTodo(findTodo);
    }
  }, [slug]);
  const handleClick = () => {
    router.back();
  };

  return (
    <div className="w-full h-[100vh] bg-white text-black justify-center items-center flex">
      <div className="bg-[#333] w-[40%] h-[40%] p-4 text-white">
        <h1 className="p-2">Name: {currentTodo?.name}</h1>
        <h1 className="p-2">Score: {currentTodo?.score}</h1>
        <h1 className="p-2">Desc: {currentTodo?.desc ? currentTodo.desc : 'NULL'}</h1>
        <h1 className="p-2">status: {currentTodo?.status}</h1>
        <div className="flex justify-end">
          <button className="p-2 bg-red-600 rounded" onClick={handleClick}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
