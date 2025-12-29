import fs from 'fs'
import Link from 'next/link'
import path from 'path'

const counterPath = path.join(process.cwd(), '..', 'counter.json')
const counterData = JSON.parse(fs.readFileSync(counterPath, 'utf8'))
const iterations = counterData.iterations

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-in-200/30 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to AgencySMM
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Link
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="/register"
          >
            Register →
          </Link>
          <Link
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="/login"
          >
            Login →
          </Link>
        </div>
      </div>

      <div className="relative flex place-items-center flex-col">
        <h1 className="text-4xl font-bold">
          AgencySMM - Marketing Tool
        </h1>
        <p className="text-lg mt-2 text-gray-600 dark:text-gray-400">
          Times we've iterated with AI: {iterations}
        </p>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Account
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Create your account and get started.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Workspaces
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Manage your marketing workspaces.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Brand Discovery
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Analyze brands with AI.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Ad Creation
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Generate ads using AI characters.
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>
          Created on 28-12-2025 •{' '}
          <Link
            href="https://clearfuturecs.com/"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Clear Future CS
          </Link>
        </p>
      </div>
    </main>
  )
}
