import cloudinary from '../cloudinary.v2';
import _ from 'lodash';

cloudinary.config(true);
let max_results = 500;

export function deleteAllResources(next_cursor) {
  if(!nextCursor) { return []}
  cloudinary.api.delete_all_resources( { next_cursor, max_results}, (error, result)->{
    if(error) {
      console.error( error);
      return [];
    } else {
      return _.assign(result.delete_all_resources, deleteAllResources(res.next_cursor))
    }
  })
}

