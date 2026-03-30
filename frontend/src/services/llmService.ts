import axios from 'axios';
import { interpretationUrl } from '../constants/constants';

export const getSingleChartInterpretation = async (chart: unknown): Promise<string> => {
  const res = await axios.post(`${interpretationUrl}/api/astro-interpretation/single-chart`, {
    chart,
  });

  return res.data.interpretation;
};

export const getBiwheelInterpretation = async (
  synastry: unknown,
  compatibility: unknown
): Promise<string> => {
  const res = await axios.post(
    `${interpretationUrl}/api/astro-interpretation/biwheel`,
    {
      synastry,
      compatibility,
    }
  );

  return res.data.interpretation;
};