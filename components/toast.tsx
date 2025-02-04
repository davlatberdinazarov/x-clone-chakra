"use client"

import { Button } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"

const Toast = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        toaster.create({
          description: "Twit created successfully",
          type: "success",
          duration: 3000, // 3 seconds
        })
      }
    >
      Show Toast uuu
    </Button>
  )
}

export default Toast;
