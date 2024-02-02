import { useColorModeValue } from '@chakra-ui/react';

export function useColorModeColor() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return {
    bgColor,
    borderColor,
  };
}
