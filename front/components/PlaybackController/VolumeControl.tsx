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
import { BsVolumeUp, BsVolumeDown, BsVolumeMute } from 'react-icons/bs';

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

  const VolumeIcon =
    lockValue >= 50 ? BsVolumeUp : lockValue >= 1 ? BsVolumeDown : BsVolumeMute;

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Button variant="ghost" w={6} h={6} p={0} m={0}>
          <Icon as={VolumeIcon} w={6} h={6} p={0} m={0} color="gray.500" />
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
