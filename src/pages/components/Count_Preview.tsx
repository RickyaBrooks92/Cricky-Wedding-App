import { useContext } from "react";
import { SnapshotsContext } from "../_app";

const Count_Preview = () => {
  const { snapshots, setSnapshots } = useContext(SnapshotsContext) as {
    snapshots: number;
    setSnapshots: (snapshots: number) => void;
  };

  return (
    <div>
      <p>{snapshots}</p>
    </div>
  );
};

export default Count_Preview;
