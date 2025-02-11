import { Drawer } from '@mui/joy';
import { Button } from '@usememos/mui';
import { MenuIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const NavigationDrawer = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const toggleDrawer =
    (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(inOpen);
    };

  return (
    <>
      <Button
        variant="plain"
        className="!bg-transparent px-2"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon className="h-auto w-5 dark:text-gray-400" />
      </Button>
      <Drawer anchor="left" size="sm" open={open} onClose={toggleDrawer(false)}>
        <div className="h-full w-full overflow-auto bg-zinc-100 px-4 dark:bg-zinc-900">
          <Navigation />
        </div>
      </Drawer>
    </>
  );
};

export default NavigationDrawer;
