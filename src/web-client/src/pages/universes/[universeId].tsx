import { useRouter } from "next/router";
import { useEffect } from "react";

const UniversePage: React.FC<{}> = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/universes");
  }, [router]);

  return null;
};

export default UniversePage;
