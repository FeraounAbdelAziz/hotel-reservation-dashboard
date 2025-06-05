import { useState } from "react";
 
export default function useDialogState<T = null>(initial: T) {
  const [state, setState] = useState<T>(initial);
  return [state, setState] as const;
} 