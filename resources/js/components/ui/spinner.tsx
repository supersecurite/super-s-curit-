import { useTrans as useUiTranslations } from '@/hooks/use-trans';
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
    const { t: uiText } = useUiTranslations();

  return (
    <Loader2Icon
      role="status"
      aria-label={uiText('ui.components.text_dc380888c4e2', "Chargement")}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
