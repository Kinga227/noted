package edu.bbte.licenta.skim2187.notedbackend.mapper;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.PointInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.PointOutDto;
import edu.bbte.licenta.skim2187.notedbackend.model.Point;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class PointMapper {

    @Mapping(target = "id", ignore = true)
    public abstract Point mapToEntity(PointInDto createRequestDto);

    public abstract PointOutDto mapToDto(Point createRequest);
}
