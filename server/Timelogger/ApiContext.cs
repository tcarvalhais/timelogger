using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Timelogger.DTOS;
using Timelogger.Entities;

namespace Timelogger
{
	public enum Status
	{
		New,
		InProgress,
		Completed
	}

	public class TotalTimeRegisteredObject
	{
		public int TotalTimeMinutes { get; set; }
	}

	public class ApiContext : DbContext, IApiContext
	{
		public DbSet<Project> Projects { get; set; }
		public DbSet<TimeRegistration> TimeRegistered { get; set; }

		public ApiContext(DbContextOptions<ApiContext> options) : base(options)
		{
			// Nothing to be done...
		}

		public IEnumerable<Project> GetProjects()
		{
			return Projects.ToList();
		}

		public Project GetProjectDetails(Guid projectId)
		{
			var project = Projects.Where(p => p.Id == projectId).SingleOrDefault();
			return project;
		}

		public Project CreateProject(CreateProjectDTO createProjectDTO)
		{
			Project newProject = new Project()
			{
				Id = Guid.NewGuid(),
				Name = createProjectDTO.Name,
				CreationDateTimestamp = createProjectDTO.CreationDateTimestamp,
				DeadlineDateTimestamp = createProjectDTO.DeadlineDateTimestamp,
				ProjectStatus = Status.New
			};

			Projects.Add(newProject);
			SaveChanges();

			return newProject;
		}

		public void DeleteProject(Guid projectId)
		{
			var project = Projects.Find(projectId);
			if (project != null)
			{
				Projects.Remove(project);
				SaveChanges();
			}
		}

		public IEnumerable<TimeRegistration> GetAllTimesRegistered(Guid projectId)
		{
			var allTimesRegistered = new List<TimeRegistration>();
			var project = Projects.Find(projectId);
			if (project != null)
			{
				allTimesRegistered = TimeRegistered.Where(tr => tr.ProjectId == projectId).ToList();
			}

			return allTimesRegistered;
		}

		public int GetTotalTimeRegistered(Guid projectId)
		{
			int totalMinutes = 0;

			var project = Projects.Find(projectId);
			if (project != null)
			{
				totalMinutes = TimeRegistered
					.Where(tr => tr.ProjectId == projectId)
					.Sum(tr => tr.TimeMinutes);
			}

			return totalMinutes;
		}

		public void ChangeProjectStatus(Guid projectId, Status newStatus)
		{
			var project = Projects.Find(projectId);
			if (project != null)
			{
				project.ProjectStatus = newStatus;
				SaveChanges();
			}
		}

		public TimeRegistration RegisterTime(Guid projectId, RegisterTimeDTO registerTimeDTO)
		{
			var timeRegistry = new TimeRegistration();

			var project = Projects.Find(projectId);
			if (project != null)
			{
				timeRegistry = new TimeRegistration()
				{
					Id = Guid.NewGuid(),
					ProjectId = projectId,
					RegistrationTimestamp = registerTimeDTO.RegistrationTimestamp,
					TimeMinutes = registerTimeDTO.TimeMinutes
				};


				TimeRegistered.Add(timeRegistry);
				SaveChanges();
			}

			return timeRegistry;
		}
	}
}
