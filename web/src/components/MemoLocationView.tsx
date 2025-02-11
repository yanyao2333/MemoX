import type { Location } from '@/types/proto/api/v1/memo_service';
import { LatLng } from 'leaflet';
import { MapPinIcon } from 'lucide-react';
import { useState } from 'react';
import LeafletMap from './LeafletMap';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';

interface Props {
  location: Location;
}

const MemoLocationView: React.FC<Props> = (props: Props) => {
  const { location } = props;
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <p className="flex w-full flex-row items-center gap-0.5 text-gray-500">
          <MapPinIcon className="h-auto w-4 shrink-0" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-normal text-sm">
            {location.placeholder
              ? location.placeholder
              : `[${location.latitude}, ${location.longitude}]`}
          </span>
        </p>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="flex min-w-80 flex-col items-start justify-start sm:w-128">
          <LeafletMap
            latlng={new LatLng(location.latitude, location.longitude)}
            readonly={true}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MemoLocationView;
