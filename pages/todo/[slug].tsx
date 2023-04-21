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
    router.back();
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { slug } = router.query;
    // console.log('slug ::', slug);
    ApiHandle.get(`/api/todo/?slug=${slug}`)
      .then((res) => {})
      .catch((err) => console.log('err ::', err));
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

// export const getServerSideProps = async (context: any) => {
//   // console.log('context req ::', context.req);
//   const prisma = new PrismaClient();
//   const todo = await prisma.todo.findUnique({
//     where: { name: context.query.slug },
//   });
//   return {
//     props: {
//       todo,
//     } as DetailProp,
//   };
// };
