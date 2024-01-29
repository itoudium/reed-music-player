import {
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import React from 'react';
import { BsVolumeUp } from 'react-icons/bs';

export function VolumeControl() {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Button variant="ghost">
          <Icon as={BsVolumeUp} w={6} h={6} color="gray.500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent w={10}>
        <PopoverBody h={28} w={10}>
          <Slider
            defaultValue={30}
            focusThumbOnChange={true}
            onChangeEnd={(val) => console.log(val)}
            colorScheme="green"
            orientation="vertical"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
