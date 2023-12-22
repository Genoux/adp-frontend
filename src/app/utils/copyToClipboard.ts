const copyToClipboard = (link: string) => {
  const copy = window.location.href + link;

  navigator.clipboard
    .writeText(copy)
    .then(() => {
      console.log('Copied to clipboard successfully!');
    })
    .catch((err) => {
      console.error('Could not copy text: ', err);
      throw new Error('Could not copy text');
    });

  return { message: 'Copied to clipboard' };
};

export default copyToClipboard;
