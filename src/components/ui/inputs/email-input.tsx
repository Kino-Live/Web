export default function EmailInput() {
    return (
        <div className="flex flex-col space-y-1">
            <label
                htmlFor="email"
                className="text-gray-700">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-200 focus:outline-none focus:ring focus:ring-green-400"
                required
            />
        </div>
    );
}
