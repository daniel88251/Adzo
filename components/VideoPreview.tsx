import React from 'react';

interface VideoPreviewProps {
  src: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ src }) => {
  return (
    <div className="relative group max-w-lg shadow-xl rounded-lg overflow-hidden w-full">
      <video 
        controls 
        src={src} 
        className="w-full h-auto rounded-lg" 
        autoPlay 
        loop 
        muted 
        playsInline
      />
    </div>
  );
};

export default VideoPreview;
