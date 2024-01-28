import { secondToDisplayTime } from './timeUtil';

test('secondToDisplayTime', () => {
  expect(secondToDisplayTime(0)).toBe('0:00');
  expect(secondToDisplayTime(1)).toBe('0:01');
  expect(secondToDisplayTime(10)).toBe('0:10');
  expect(secondToDisplayTime(60)).toBe('1:00');
  expect(secondToDisplayTime(61)).toBe('1:01');
  expect(secondToDisplayTime(600)).toBe('10:00');
  expect(secondToDisplayTime(601)).toBe('10:01');
});
