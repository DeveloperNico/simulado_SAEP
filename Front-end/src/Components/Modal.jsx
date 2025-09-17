export function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="overlay">
            <div className="modal">
                <div className="header">
                    <button className="closeButton" onClick={onClose}>X</button>
                </div>
                <div className="body">
                    {children}
                </div>
            </div>
        </div>
    );
}