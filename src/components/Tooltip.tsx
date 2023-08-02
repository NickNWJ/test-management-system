export default function Tooltip({ message, children }) {
    return (
    <div className="group relative flex">
        {children}
        <span className="absolute bottom-5 right-5 
        scale-0 transition-all rounded bg-black 
        p-2 text-xs text-white group-hover:scale-100">{message}</span>
    </div>
    )
}