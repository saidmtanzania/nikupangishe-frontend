"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { chatApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface StartChatButtonProps {
  propertyId: string;
  ownerId?: string;
  agentId?: string;
  className?: string;
}

export function StartChatButton({
  propertyId,
  ownerId,
  agentId,
  className,
}: StartChatButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const preferredRecipientId = agentId ?? ownerId;
  const fallbackRecipientId =
    agentId && ownerId
      ? preferredRecipientId === agentId
        ? ownerId
        : agentId
      : undefined;

  const recipientId =
    preferredRecipientId && preferredRecipientId !== user?.id
      ? preferredRecipientId
      : fallbackRecipientId && fallbackRecipientId !== user?.id
        ? fallbackRecipientId
        : undefined;

  const recipientLabel = recipientId === ownerId ? "Owner" : "Agent";

  async function handleClick() {
    if (!isAuthenticated || !token) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!recipientId) {
      toast({
        title: "Chat unavailable",
        description: "No valid chat recipient is available for this listing.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const conversation = await chatApi.startConversation(
        {
          recipientId,
          houseId: propertyId,
          // Seed first message so the conversation appears in the chat list immediately.
          message: "Hi, I am interested in this property.",
        },
        token
      );
      router.push(`/chat?conversation=${encodeURIComponent(conversation.id)}`);
    } catch (err: any) {
      toast({
        title: "Unable to start chat",
        description: err?.message ?? "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const label = `Chat with ${recipientLabel}`;

  return (
    <Button onClick={handleClick} className={className} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Starting chat...
        </>
      ) : (
        <>
          <MessageSquare className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
