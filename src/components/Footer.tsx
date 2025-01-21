import type { FC } from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import TikTokIcon from '@components/icons/TikTokIcon';
import { useSocialLinks } from '@hooks/useSocialLinks';
import RatingsDisplay from '@components/home/features/RatingsDisplay.js';
import { useAppSelector } from '@store';

const Footer: FC = () => {
  const { socialLinks, loading } = useSocialLinks();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          <div>
            <RatingsDisplay />
          </div>
          
          {!loading && (
            <div className="flex flex-col max-[400px]:space-y-4 min-[401px]:flex-row items-center max-[400px]:space-x-0 min-[401px]:space-x-6 mb-8">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                >
                  <Facebook className="h-7 w-7" />
                </a>
              )}
              {socialLinks.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                >
                  <TikTokIcon className="h-7 w-7" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                >
                  <Instagram className="h-7 w-7" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                >
                  <Youtube className="h-7 w-7" />
                </a>
              )}
            </div>
          )}

          <div className="text-gray-400 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} iAircon Easy Booking. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;