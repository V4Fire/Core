import type { Mocks } from 'core/data/interface';

import { responseData } from 'core/data/middlewares/attach-mock/__mocks__/response-data';

export default <Mocks>{
	GET: [
		{
      response: responseData
		}
	]
};
