"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Instagram, Share2, Check, Copy } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SocialShareProps {
  url: string
  title: string
  summary?: string
}

export function SocialShare({ url, title, summary = "" }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  // Ensure we have the full URL
  const fullUrl = url.startsWith("http") ? url : `https://brickproperty.com${url}`

  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedSummary = encodeURIComponent(summary)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't have a direct share URL, but we'll handle this in the click handler
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === "instagram") {
      // For Instagram, we'll copy the URL to clipboard and show a message
      copyToClipboard()
      alert("URL disalin ke clipboard. Buka Instagram dan tempel URL untuk membagikan.")
      return
    }

    // Open share dialog in a new window
    window.open(shareLinks[platform], "_blank", "width=600,height=400")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <Share2 className="mr-2 h-4 w-4" />
        Bagikan Artikel
      </h3>

      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bagikan ke Twitter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#4267B2] hover:bg-[#4267B2]/90 text-white"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bagikan ke Facebook</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#0077B5] hover:bg-[#0077B5]/90 text-white"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bagikan ke LinkedIn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 text-white"
                onClick={() => handleShare("instagram")}
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Share on Instagram</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Salin URL untuk Instagram</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy URL</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "URL disalin!" : "Salin URL"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

