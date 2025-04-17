
import React from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  const isYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const isVimeoUrl = (url: string): boolean => {
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;
    return vimeoRegex.test(url);
  };

  const getYoutubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getVimeoEmbedUrl = (url: string): string => {
    const vimeoRegex = /vimeo\.com\/([0-9]+)/;
    const match = url.match(vimeoRegex);
    const videoId = match ? match[1] : null;
    return `https://player.vimeo.com/video/${videoId}`;
  };

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  if (isYoutubeUrl(url)) {
    return (
      <iframe
        src={getYoutubeEmbedUrl(url)}
        className="w-full h-full"
        allowFullScreen
        title={title}
      />
    );
  }

  if (isVimeoUrl(url)) {
    return (
      <iframe
        src={getVimeoEmbedUrl(url)}
        className="w-full h-full"
        allowFullScreen
        title={title}
      />
    );
  }

  // Default to HTML5 video player for MP4 and other direct video URLs
  return (
    <video
      className="w-full h-full"
      controls
      title={title}
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
