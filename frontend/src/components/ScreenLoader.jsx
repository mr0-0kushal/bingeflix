import ClipLoader from "react-spinners/ClipLoader";

const ScreenLoader = () => {
    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <ClipLoader color="#F2613F" size={70} cssOverride={{
                borderWidth: "6px",
        }} />
        </div>
    );
};

export default ScreenLoader;
