interface SwitcherProps {
  id: string;
  enabled: boolean;
  setEnabled: () => void;
}

const Switcher: React.FC<SwitcherProps> = ({ id, enabled, setEnabled }) => {
  return (
    <div className="inline-block">
      <label
        htmlFor={id}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only"
            onChange={() => setEnabled()}
          />
          <div
            className={`block h-6 w-10 rounded-full bg-meta-9 ${
              enabled && '!bg-blue-gray-800'
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition ${
              enabled && '!right-1 !translate-x-full dark:!bg-white'
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default Switcher;
