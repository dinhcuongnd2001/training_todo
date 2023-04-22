import { Todo } from '@/interfaces';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next/types';
import ApiHandle from '../../service';
interface DetailProp {
  todo: Todo;
}

export default function DetailTodo({ todo }: DetailProp) {
  const [currentTodo, setCurrentTodo] = useState<Todo>(todo);
  const router = useRouter();
  const handleClick = () => {
    router.push('/');
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { slug } = router.query;
    ApiHandle.get(`/api/todo/name/${slug}`)
      .then((res) => {
        setCurrentTodo(res.data);
      })
      .catch((e) => {
        alert(e.response.data.message);
        router.push('/');
      });
  }, [router.isReady]);

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
