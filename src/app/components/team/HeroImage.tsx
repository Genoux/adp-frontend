import ExtendedImage from '@/app/components/common/ExtendedImage';

const HeroImage = ({ type, hero, altText }: { type: 'tiles' | 'splash' | 'centered'; hero: string; altText: string }) => {

  return (
    <ExtendedImage
      alt={altText}
      type={type}
      src={hero}
      style={{ objectPosition: 'center', objectFit: 'cover' }}
      fill
    />
  );
};

export default HeroImage;
