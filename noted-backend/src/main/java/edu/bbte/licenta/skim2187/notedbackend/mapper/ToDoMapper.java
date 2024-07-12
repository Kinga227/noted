package edu.bbte.licenta.skim2187.notedbackend.mapper;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.ToDoInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.ToDoOutDto;
import edu.bbte.licenta.skim2187.notedbackend.model.ToDo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class ToDoMapper {

    @Mapping(target = "id", ignore = true)
    public abstract ToDo mapToEntity(ToDoInDto createRequestDto);

    public abstract ToDoOutDto mapToDto(ToDo createRequest);
}
