import ExtendedImage from '@/app/components/common/ExtendedImage';

const HeroImage = ({ type, heroId, altText }: { type: string; heroId: string; altText: string }) => {

  return (
    <ExtendedImage
      alt={altText}
      variant={type}
      type={type}
      src={heroId}
      style={{ objectPosition: 'center', objectFit: 'cover' }}
      fill
    />
  );
};

export default HeroImage;
