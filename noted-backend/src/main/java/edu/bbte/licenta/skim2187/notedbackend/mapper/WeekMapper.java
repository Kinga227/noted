package edu.bbte.licenta.skim2187.notedbackend.mapper;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.WeekInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.WeekOutDto;
import edu.bbte.licenta.skim2187.notedbackend.model.Week;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class WeekMapper {

    @Mapping(target = "id", ignore = true)
    public abstract Week mapToEntity(WeekInDto createRequestDto);

    public abstract WeekOutDto mapToDto(Week createRequest);
}
