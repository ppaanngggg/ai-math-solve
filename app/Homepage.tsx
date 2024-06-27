import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function Homepage(props: { user: User | null }) {
  return (
    <div className="my-10 px-3 w-[64rem] max-w-full flex flex-col justify-center items-center">
      <h1 className="text-5xl font-extrabold">AI Math Solver 🥳</h1>
      <h2 className="w-[48rem] max-w-full mt-6 text-lg font-semibold text-justify">
        Unlock the power of AI. Whether uploading photos or describing math
        problems, our advanced multi-modal AI can assist you in solving math
        problems step by step. Additionally, you can easily save and share your
        math notes.
      </h2>
      <div className="mt-12 w-full h-[20rem] card card-side bg-base-100 shadow-xl">
        <figure className="w-[20rem] h-[20rem]">
          <Image
            src="/cover.jpg"
            alt="cover image - robot teach student to learn math"
            width={300}
            height={300}
          />
        </figure>
        <div className="flex-1 card-body overflow-auto">
          <h2 className="card-title">
            Most powerful multi-modal AI have outperformed humans in visual math
            challenges!
          </h2>
          <p className="mt-0.5 text-justify">
            <Link
              href="https://mathvista.github.io"
              className="underline"
              rel="noopener ugc nofollow"
              target="_blank"
            >
              <Image
                src="/mathvista.webp"
                alt="MathVista logo"
                width={24}
                height={24}
                className="inline"
              />
              <b>MathVista</b>
            </Link>{' '}
            is a benchmark designed to integrate challenges from various
            mathematical and visual tasks. Although the average human
            performance reaches <b>60.3</b>, the most advanced AI has reached{' '}
            <span className="text-red-500 font-bold">63.9</span>.
          </p>
          <p className="text-justify">
            Our AI assistant ship with{' '}
            <Link
              href="https://deepmind.google/technologies/gemini/"
              className="underline"
              rel="noopener ugc nofollow"
              target="_blank"
            >
              <b>Google Gemini 1.5 Pro</b>
            </Link>
            , the most powerful AI, can help you solve math problems rapidly and
            clearly.
          </p>
          <div className="card-actions justify-center">
            <Link href={props.user != null ? '/pricing' : '/signin'}>
              <button className="btn btn-primary text-lg font-semibold hover:scale-105">
                🚀 Get Start !
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/*<div className="mt-10 w-full flex flex-col items-center justify-center bg-base-100">*/}
      {/*  <h2 className="mt-5 text-4xl font-bold">TODO</h2>*/}
      {/*  <h3 className="mt-5"></h3>*/}
      {/*  <div className="mt-5 card card-compact bg-base-300 shadow-xl">*/}
      {/*    <div className="card-body">*/}
      {/*      <h4 className="card-title">TODO</h4>*/}
      {/*      <p>TODO</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
