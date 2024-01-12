import http from '../http-common';

const OverviewService = {
  getCantineOverview: () => {
    return http.get('/overview/cantine-overview');
  },
};

export default OverviewService;
