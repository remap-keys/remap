import React, { useEffect } from 'react';

type ITweetButton = {
  url: string;
};

export default function TweetButton(props: ITweetButton) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  });
  return (
    <a
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      className="twitter-share-button"
      data-size="large"
      data-url={props.url}
      data-hashtags="remap"
      data-show-count="false"
    >
      Tweet
    </a>
  );
}
