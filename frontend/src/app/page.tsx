import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-in-200/30 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to AgencySMM
        </p>
      </div>

      <div className="relative flex place-items-center flex-col">
        <Link
          href="https://clearfuturecs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://assets.cdn.filesafe.space/jOHIRKxHby1MsnSq2OwP/media/688cc5a00b03e1cc23405f1b.svg"
            alt="Company Logo"
            className="w-32 h-32 mb-4 border-2 border-black ring-2 ring-red-500 cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        <h1 className="text-4xl font-bold mb-8">
          AgencySMM - Marketing Tool
        </h1>
        <div className="flex gap-4">
          <Link
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            href="/register"
          >
            Register →
          </Link>
          <Link
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            href="/login"
          >
            Login →
          </Link>
        </div>
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
