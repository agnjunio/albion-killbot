function isAlbionId(id) {
  return /[\w-]{22}/.test(id);
}

function isTrackEntity(entity) {
  return (
    entity && typeof entity.id === "string" && typeof entity.name === "string" && typeof entity.server === "string"
  );
}

function toTrackEntity(entity, server) {
  if (!entity) return entity;

  if (entity.Id && entity.Name) {
    return {
      id: entity.Id,
      name: entity.Name,
      server: server.id,
    };
  }

  if (entity.AllianceId && entity.AllianceTag) {
    return {
      id: entity.AllianceId,
      name: entity.AllianceTag,
      server: server.id,
    };
  }

  return entity;
}

module.exports = {
  isAlbionId,
  isTrackEntity,
  toTrackEntity,
};
