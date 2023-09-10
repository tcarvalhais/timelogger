using System;
using Microsoft.AspNetCore.Mvc;
using Timelogger.DTOS;

namespace Timelogger.Api.Controllers
{
	[ApiController]
	[Route("projects")]
	public class ProjectsController : ControllerBase
	{
		private readonly ApiContext _context;

		public ProjectsController(ApiContext context)
		{
			_context = context;
		}

		// Get projects
		[HttpGet("getProjects")]
		public IActionResult GetProjects()
		{
			var projects = _context.GetProjects();
			return Ok(projects);
		}

		// Get project by id
		[HttpGet("getProjectDetails/{projectId}")]
		public IActionResult GetProjectDetails(Guid projectId)
		{
			var project = _context.GetProjectDetails(projectId);
			if (project == null)
			{
				return NotFound("Project not found");
			}

			return Ok(project);
		}

		// Create project
		[HttpPost("createProject")]
		public IActionResult CreateProject(CreateProjectDTO createProjectDTO)
		{
			var createdProject = _context.CreateProject(createProjectDTO);
			return Created("Project created", createdProject);
		}

		// Delete project
		[HttpDelete("createProject/{projectId}")]
		public IActionResult DeleteProject(Guid projectId)
		{
			var project = _context.GetProjectDetails(projectId);
			if (project == null)
			{
				return NotFound("Project not found");
			}

			_context.DeleteProject(projectId);
			return Ok("Project deleted");
		}

		// Get the time registers of a project
		[HttpGet("getAllTimesRegistered/{projectId}")]
		public IActionResult GetAllTimesRegistered(Guid projectId)
		{
			var project = _context.GetProjectDetails(projectId);
			if (project == null)
			{
				return NotFound("Project not found");
			}

			var allTimesRegistered = _context.GetAllTimesRegistered(projectId);
			return Ok(allTimesRegistered);
		}

		// Get the total time registered of a project
		[HttpGet("getTotalTimeRegistered/{projectId}")]
		public IActionResult GetTotalTimeRegistered(Guid projectId)
		{
			var project = _context.GetProjectDetails(projectId);
			if (project == null)
			{
				return NotFound("Project not found");
			}

			int totalMinutes = _context.GetTotalTimeRegistered(projectId);
			var response = new
			{
				TotalTimeMinutes = totalMinutes
			};

			return Ok(response);
		}

		// Start a project
		[HttpPut("startProject/{projectId}")]
		public IActionResult StartProject(Guid projectId)
		{
			var project = _context.GetProjectDetails(projectId);
			if (project == null)
			{
				return NotFound("Project not found");
			}

			if (project.ProjectStatus == Status.InProgress)
			{
				return Conflict("Project already started");
			}

			if (project.ProjectStatus == Status.Completed)
			{
				return Conflict("Project completed");
			}

			_context.ChangeProjectStatus(projectId, Status.InProgress);
			return Ok("Project started");
		}

		// Complete a project
		[HttpPut("completeProject/{projectId}")]
		public IActionResult CompleteProject(Guid projectId)
		{
			var project = _context.GetProjectDetails(projectId);
			if (project == null)
			{
				return NotFound("Project not found");
			}

			if (project.ProjectStatus == Status.New)
			{
				return Conflict("Project not started");
			}

			if (project.ProjectStatus == Status.Completed)
			{
				return Conflict("Project already completed");
			}

			_context.ChangeProjectStatus(projectId, Status.Completed);
			return Ok("Project completed");
		}

		// Register time on a project
		[HttpPost("registerTime/{projectId}")]
		public IActionResult RegisterTime(Guid projectId, RegisterTimeDTO registerTimeDTO)
		{
			var project = _context.GetProjectDetails(projectId);
			if (project == null)
			{
				return NotFound("Project not found");
			}

			if (registerTimeDTO.TimeMinutes < 30)
			{
				return new ObjectResult("The time registered is below the 30 mins limit")
				{
					StatusCode = 406
				};
			}

			var timeRegistry = _context.RegisterTime(projectId, registerTimeDTO);
			return Created("Time registered", timeRegistry);
		}
	}
}
