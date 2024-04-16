import type { Mock } from '@storybook/test';
import { fn } from '@storybook/test';
import { NextjsRouterMocksNotAvailable } from '@storybook/core-events/preview-errors';
import * as originalNavigation from 'next/dist/client/components/navigation';

let navigationAPI: {
  push: Mock;
  replace: Mock;
  forward: Mock;
  back: Mock;
  prefetch: Mock;
  refresh: Mock;
};

/**
 * Creates a next/navigation router API mock. Used internally.
 * @ignore
 * @internal
 * */
export const createNavigation = (overrides: any) => {
  const navigationActions = {
    push: fn().mockName('next/navigation::useRouter().push'),
    replace: fn().mockName('next/navigation::useRouter().replace'),
    forward: fn().mockName('next/navigation::useRouter().forward'),
    back: fn().mockName('next/navigation::useRouter().back'),
    prefetch: fn().mockName('next/navigation::useRouter().prefetch'),
    refresh: fn().mockName('next/navigation::useRouter().refresh'),
  };

  if (overrides) {
    Object.keys(navigationActions).forEach((key) => {
      if (key in overrides) {
        (navigationActions as any)[key] = fn((...args: any[]) => {
          return (overrides as any)[key](...args);
        }).mockName(`useRouter().${key}`);
      }
    });
  }

  navigationAPI = navigationActions;

  return navigationAPI;
};

export const getRouter = () => {
  if (!navigationAPI) {
    throw new NextjsRouterMocksNotAvailable({
      importType: 'next/navigation',
    });
  }

  return navigationAPI;
};

// re-exports of the actual module
export * from 'next/dist/client/components/navigation';

// mock utilities/overrides (as of Next v14.2.0)
export const redirect = fn().mockName('next/navigation::redirect');

// passthrough mocks - keep original implementation but allow for spying
export const useSearchParams = fn(originalNavigation.useSearchParams).mockName(
  'next/navigation::useSearchParams'
);
export const usePathname = fn(originalNavigation.usePathname).mockName(
  'next/navigation::usePathname'
);
export const useSelectedLayoutSegment = fn(originalNavigation.useSelectedLayoutSegment).mockName(
  'useSelectedLayoutSegment'
);
export const useSelectedLayoutSegments = fn(originalNavigation.useSelectedLayoutSegments).mockName(
  'useSelectedLayoutSegments'
);
export const useRouter = fn(originalNavigation.useRouter).mockName('next/navigation::useRouter');
export const useServerInsertedHTML = fn(originalNavigation.useServerInsertedHTML).mockName(
  'useServerInsertedHTML'
);
export const notFound = fn(originalNavigation.notFound).mockName('next/navigation::notFound');
export const permanentRedirect = fn(originalNavigation.permanentRedirect).mockName(
  'next/navigation::permanentRedirect'
);

// Params, not exported by Next.js, is manually declared to avoid inference issues.
interface Params {
  [key: string]: string | string[];
}
export const useParams = fn<[], Params>(originalNavigation.useParams).mockName(
  'next/navigation::useParams'
);
