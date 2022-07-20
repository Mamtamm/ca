exports.page = (params) => {
  let limit = params.limit ? params.limit : 10;
  let page = params.page ? params.page : 1;
  let offset = 0 + (page - 1) * limit;
  return { limit: limit, offset: offset };
};
