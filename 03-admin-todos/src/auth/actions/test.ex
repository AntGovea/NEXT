def hikvision_list_pending(_params, context) do
    with %{context: %{current_user: user, channel: tenant}} <- context, true <- HelperResolver.is_in_rol(user.rol.name, "Guardia") do
      facial_apps = SecurityBoothApps.list_all_security_booth_apps("facial", tenant)
      residential = Residentials.get_residential_by_channel(tenant)

      if Enum.count(facial_apps) > 0 do
        # Get logs
        logs = FacialSyncs.list_pending_hikvision(tenant)

        result = Enum.reduce(logs, [], fn (log, acc) ->
          # Get house
          house = Houses.get_house(log.house_id, tenant)

          # Get extra data
          {user_name, qr, hikvision_id, face_id, level} = case log.kind do
            "family" ->
              visitor = Visitors.get_visitor(log.user, tenant)
              visit = Visits.get_visit_small(String.to_integer(log.server_response), tenant)
              # Return name
              if visitor && visit do
                {visitor.name, visit.folio, visit.hikvision_id, nil, house.hikvision_group}
              else
                {nil, nil, nil, nil, nil}
              end
            "amenity" ->
              unless log.resident do
                visitor = Visitors.get_visitor(log.user, tenant)
                visit_log = String.split(log.server_response, "-")
                visit_id = Enum.at(visit_log, 0)
                visit = Visits.get_visit_small(String.to_integer(visit_id), tenant)
                # Return name
                if visitor && visit do
                  {visitor.name, visit.folio, visit.hikvision_id, nil, house.hikvision_group}
                else
                  {nil, nil, nil, nil, nil}
                end
              else
                resident = Users.get_user(log.user, tenant)
                visit_log = String.split(log.server_response, "-")
                reservation_id = Enum.at(visit_log, 0)
                res = Reservations.get_reservation_sm(reservation_id, tenant)

                if res && resident do
                  {resident.name, res.qr_code, resident.hikvision_id, nil, house.hikvision_group_resident}
                else
                  {nil, nil, nil, nil, nil}
                end
              end
            "visitor" ->
              visitor = Visitors.get_visitor_house(log.user, tenant)
              # Return name
              if visitor do
                # Validate hikvision id before send it
                hikvision_id = if visitor.hikvision_id do visitor.hikvision_id else log.hikvision_id end
                # Return
                {visitor.visitor.name, visitor.qr_code, hikvision_id, visitor.face_id, house.hikvision_group_freq_visitor}
              else
                {nil, nil, nil, nil, nil}
              end
            "service" ->
              service = Services.get_service(log.user, tenant)
              visit = Visits.get_visit_small(String.to_integer(log.server_response), tenant)
              # Return name
              if service && visit do
                {service.name, visit.folio, visit.hikvision_id, nil, house.hikvision_group}
              else
                {nil, nil, nil, nil, nil}
              end
            "employee" ->
              employee = Employees.get_employee(log.user, tenant)
              # Return name
              if employee do
                # Validate hikvision id before send it
                hikvision_id = if employee.hikvision_id do employee.hikvision_id else log.hikvision_id end
                # Return
                {employee.name, employee.folio, hikvision_id, employee.face_id, house.hikvision_group_employee}
              else
                {nil, nil, nil, nil, nil}
              end
            "resident" ->
              resident = Users.get_user(log.user, tenant)
              # Return name
              if resident do
                {resident.name, "#{resident.id}050#{residential.id}", resident.hikvision_id, resident.face_id, house.hikvision_group_resident}
              else
                {nil, nil, nil, nil, nil}
              end
            "airbnb" ->
              resident = Users.get_user(log.user, tenant)
              # Return name
              if resident do
                # {resident.name, "#{resident.id}050#{residential.id}", resident.hikvision_id, resident.face_id}
                {resident.name, "#{resident.airbnb_folio}", resident.hikvision_id, resident.face_id, house.hikvision_group_airbnb}
              else
                {nil, nil, nil, nil}
              end
            "openevent" ->
              event = Events.get_event_no_limits(log.user, tenant)
              # Return name
              if event do
                {event.name, event.folio, event.access_level_hikvision, nil, house.hikvision_group}
              else
                {nil, nil, nil, nil, nil}
              end
            "closeevent" ->
              event = Events.get_event_visitor(log.user, tenant)
              # Return name
              if event do
                {event.name, event.folio, event.access_level_hikvision, nil, house.hikvision_group}
              else
                {nil, nil, nil, nil, nil}
              end
          end

          {start, finish} = if log.kind == "family" || log.kind == "amenity" || log.kind == "service" do
            if !log.resident && log.kind != "amenity" do
              visit_log = String.split(log.server_response, "-")
              visit_id = Enum.at(visit_log, 0)
              visit = Visits.get_visit_small(String.to_integer(visit_id), tenant)
              today = Timex.shift(visit.due_date, hours: (residential.timezone_hours * -1))
              # Return
              {today, Timex.end_of_day(today)}
            else
              visit_log = String.split(log.server_response, "-")
              # Get reservation
              res = if log.resident do
                reservation_id = Enum.at(visit_log, 0)

                Reservations.get_reservation_sm(reservation_id, tenant)
              else
                case ReservationVisitors.get_reservation_by_visit(Enum.at(visit_log, 0), tenant) do
                  nil ->
                    nil
                  rv ->
                    Reservations.get_reservation_sm(rv.reservation_id, tenant)
                end
              end

              # Date formats
              if res do
                day = HelperResolver.two_digits(res.day)
                month = HelperResolver.two_digits(res.month)
                year = res.year
                start_hour = HelperResolver.two_digits(res.start_hour)
                end_hour = HelperResolver.two_digits(res.end_hour)

                # Get dates
                {:ok, start_date, _offset} = DateTime.from_iso8601("#{year}-#{month}-#{day}T#{start_hour}:00:00+00")
                {:ok, end_date, _offset} = if res.end_hour == 24 do
                  DateTime.from_iso8601("#{year}-#{month}-#{day}T23:59:59+00")
                else
                  DateTime.from_iso8601("#{year}-#{month}-#{day}T#{end_hour}:00:00+00")
                end
                # Return
                {start_date, end_date}
              else
                cond do
                  log.kind == "openevent" || log.kind == "closeevent" ->
                    res = Events.get_event(log.user, tenant)
                    # Get dates
                    start_date = Timex.shift(res.due_date, hours: (residential.timezone_hours * -1))
                    end_date = Timex.shift(res.finish_date, hours: (residential.timezone_hours * -1))
                    # Return
                    {start_date, end_date}
                  log.kind == "airbnb" ->
                    user = Users.get_user(log.user, tenant)
                    # Get dates
                    start_date = Timex.shift(user.airbnb_start, hours: (residential.timezone_hours * -1))
                    end_date = Timex.shift(user.airbnb_end, hours: (residential.timezone_hours * -1))
                    # Return
                    {start_date, end_date}
                  true ->
                    today = DateTime.utc_now()
                    today = Timex.shift(today, hours: (residential.timezone_hours * -1))
                    # Return
                    {today, Timex.shift(today, days: 400)}
                end
              end
            end
          else
            cond do
              log.kind == "airbnb" ->
                user = Users.get_user(log.user, tenant)
                # Get dates
                start_date = Timex.shift(user.airbnb_start, hours: (residential.timezone_hours * -1))
                end_date = Timex.shift(user.airbnb_end, hours: (residential.timezone_hours * -1))
                # Return
                {start_date, end_date}
              true ->
                today = DateTime.utc_now()
                today = Timex.shift(today, hours: (residential.timezone_hours * -1))
                # Return
                {today, Timex.shift(today, days: 400)}
            end
          end

          # Amenity group
          amenity_level = if log.kind == "amenity" do
            visit_log = String.split(log.server_response, "-")
            space_id = Enum.at(visit_log, 1)

            if Enum.count(visit_log) > 1 do
              case Spaces.get_space!(String.to_integer(space_id), tenant) do
                nil -> nil
                space -> space.access_level_hikvision
              end
            else
              nil
            end
          else
            nil
          end

          user_id = if log.kind == "amenity" && log.resident do
            visit_log = String.split(log.server_response, "-")
            Enum.at(visit_log, 0)
          else
            log.user
          end

          hikvision = if log.kind == "amenity" && log.resident && log.action == "delete" do
            visit_log = String.split(log.server_response, "-")
            reservation_id = Enum.at(visit_log, 0)
            res = Reservations.get_reservation_sm(reservation_id, tenant)
            if res do res.hikvision_id else nil end
          else
            hikvision_id
          end

          # Map of data
          if user_name do
            # Validate date format
            start = case start do
              {:error, :invalid_date} -> ""
              valid_date -> valid_date
            end
            finish = case finish do
              {:error, :invalid_date} -> ""
              valid_date -> valid_date
            end

            acc ++ [%{user_id: user_id, kind: log.kind, name: user_name, house: house.address, id: log.id, qr: qr, levels: level, amenity_level: amenity_level, due_date: start, end_date: finish, action: log.action, access_kind: log.access_kind, hikvision_id: hikvision, face_id: face_id, resident: log.resident, tag_action: log.tag_action, tag_number: log.tag_number}]
          else
            acc
          end
        end)

        # Response
        {:ok, result}
      else
        {:error, "Necesitas dar de alta un modulo de facial en el residencial."}
      end
    else
      false -> {:error, "Bad permisson"}
      %{context: _} -> {:error, "Bad authentication"}
    end
  end
