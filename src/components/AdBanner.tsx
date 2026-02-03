interface CustomAd {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
}

interface AdBannerProps {
  position: "header" | "sidebar" | "content" | "footer";
  adsensePublisherId?: string;
  adsenseSlotId?: string;
  customAds?: CustomAd[];
  className?: string;
}

export function AdBanner({
  position,
  adsensePublisherId,
  customAds = [],
  className = "",
}: AdBannerProps) {
  // Find custom ad for this position
  const customAd = customAds.find((ad) => ad.position === position);

  // If there's a custom ad, show it
  if (customAd) {
    return (
      <div className={`ad-banner ad-${position} ${className}`}>
        <a
          href={customAd.linkUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block"
        >
          <img
            src={customAd.imageUrl}
            alt={customAd.name}
            className="w-full h-auto rounded-lg"
          />
        </a>
      </div>
    );
  }

  // If AdSense is configured, show AdSense ad
  if (adsensePublisherId) {
    // AdSense slot IDs based on position
    const slotConfig: Record<string, { format: string; style: React.CSSProperties }> = {
      header: {
        format: "horizontal",
        style: { display: "block", width: "100%", height: "90px" },
      },
      sidebar: {
        format: "vertical",
        style: { display: "block", width: "300px", height: "250px" },
      },
      content: {
        format: "rectangle",
        style: { display: "block", width: "100%", height: "250px" },
      },
      footer: {
        format: "horizontal",
        style: { display: "block", width: "100%", height: "90px" },
      },
    };

    const config = slotConfig[position] || slotConfig.content;

    return (
      <div className={`ad-banner ad-${position} ${className}`}>
        <ins
          className="adsbygoogle"
          style={config.style}
          data-ad-client={adsensePublisherId}
          data-ad-format={config.format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // No ad configured for this position
  return null;
}

// Component for the AdSense script (add to layout)
export function AdSenseScript({ publisherId }: { publisherId: string }) {
  if (!publisherId) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}
