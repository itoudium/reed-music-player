import {
  Button,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { BsVolumeUp } from 'react-icons/bs';

export function VolumeControl({
  onChangeEnd,
  value,
}: {
  onChangeEnd: (val: number) => void;
  value: number;
}) {
  const [lock, setLock] = React.useState(false);
  const [lockValue, setLockValue] = React.useState(value);

  React.useEffect(() => {
    if (!lock) {
      setLockValue(value);
    }
  }, [value]);

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
            value={lockValue}
            focusThumbOnChange={true}
            onChangeStart={() => setLock(true)}
            onChange={(v) => setLockValue(v)}
            onChangeEnd={(v) => {
              setLock(false);
              onChangeEnd(v);
            }}
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
