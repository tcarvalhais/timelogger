using NUnit.Framework;
using Timelogger.Api.Controllers;
using Timelogger.DTOS;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Timelogger.Entities;

namespace Timelogger.Tests.Controllers
{
    [TestFixture]
    public class ProjectsControllerTests
    {
        private ProjectsController _controller;
        private IApiContext _context;

        [SetUp]
        public void Setup()
        {
            _context = A.Fake<IApiContext>();
            _controller = new ProjectsController(_context);
        }

        [Test]
        public void GetProjects_ReturnsOkResult()
        {
            // Arrange
            var project = new Project
            {
                Id = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e"),
                Name = "The Very First Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.New
            };

            var projects = new List<Project> { project };
            A.CallTo(() => _context.GetProjects()).Returns(projects);

            // Act
            var result = _controller.GetProjects() as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.IsNotNull(result.Value as IEnumerable<ProjectDTO>);
        }

        [Test]
        public void GetProjectDetails_ReturnsOkResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "The Very First Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.New
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            // Act
            var result = _controller.GetProjectDetails(projectId) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.IsNotNull(result.Value as ProjectDTO);
        }

        [Test]
        public void GetProjectDetails_ReturnsNotFoundResult()
        {
            // Arrange
            var projectId = new Guid("0834db09-7f41-422e-8fe7-979d05c271cc");
            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(null);

            // Act
            var result = _controller.GetProjectDetails(projectId) as NotFoundObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Project not found", result.Value);
        }

        [Test]
        public void CreateProject_ReturnsCreatedResult()
        {
            // Arrange
            var createProjectDTO = new CreateProjectDTO
            {
                Name = "New Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389
            };

            var createdProject = new Project
            {
                Id = Guid.NewGuid(),
                Name = createProjectDTO.Name,
                CreationDateTimestamp = createProjectDTO.CreationDateTimestamp,
                DeadlineDateTimestamp = createProjectDTO.DeadlineDateTimestamp,
                ProjectStatus = Status.New
            };

            A.CallTo(() => _context.CreateProject(createProjectDTO)).Returns(createdProject);

            // Act
            var result = _controller.CreateProject(createProjectDTO) as CreatedResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(201, result.StatusCode);
            Assert.IsNotNull(result.Value as ProjectDTO);
        }

        [Test]
        public void DeleteProject_ReturnsOkResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "The Project to Delete",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.New
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);
            A.CallTo(() => _context.DeleteProject(projectId)).DoesNothing();

            // Act
            var result = _controller.DeleteProject(projectId) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual("Project deleted", result.Value);
        }

        [Test]
        public void DeleteProject_ReturnsNotFoundResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(null);

            // Act
            var result = _controller.DeleteProject(projectId) as NotFoundObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Project not found", result.Value);
        }

        [Test]
        public void GetAllTimesRegistered_ReturnsOkResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.New
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            var timeRegistrations = new List<TimeRegistration>
            {
                new TimeRegistration
                {
                    Id = Guid.NewGuid(),
                    ProjectId = projectId,
                    RegistrationTimestamp = 1694120389,
                    TimeMinutes = 0
                },
            };

            A.CallTo(() => _context.GetAllTimesRegistered(projectId)).Returns(timeRegistrations);

            // Act
            var result = _controller.GetAllTimesRegistered(projectId) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);

            var timeRegistrationResult = result.Value as List<TimeRegistration>;
            Assert.IsNotNull(timeRegistrationResult);
            Assert.AreEqual(timeRegistrations.Count, timeRegistrationResult.Count);
        }

        [Test]
        public void GetAllTimesRegistered_ReturnsNotFoundResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(null);

            // Act
            var result = _controller.GetAllTimesRegistered(projectId) as NotFoundObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Project not found", result.Value);
        }

        [Test]
        public void GetTotalTimeRegistered_ReturnsOkResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.New
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            var totalMinutes = 120;
            A.CallTo(() => _context.GetTotalTimeRegistered(projectId)).Returns(totalMinutes);

            // Act
            var result = _controller.GetTotalTimeRegistered(projectId) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);

            var response = result.Value as TotalTimeRegisteredObject;
            Assert.IsNotNull(response);
            Assert.AreEqual(totalMinutes, response.TotalTimeMinutes);
        }

        [Test]
        public void GetTotalTimeRegistered_ReturnsNotFoundResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(null);

            // Act
            var result = _controller.GetTotalTimeRegistered(projectId) as NotFoundObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Project not found", result.Value);
        }

        [Test]
        public void StartProject_ReturnsOkResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.New
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            // Act
            var result = _controller.StartProject(projectId) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual("Project started", result.Value);
        }

        [Test]
        public void StartProject_ReturnsConflictProjectAlreadyStarted()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.InProgress
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            // Act
            var result = _controller.StartProject(projectId) as ConflictObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(409, result.StatusCode);
            Assert.AreEqual("Project already started", result.Value);
        }

        [Test]
        public void StartProject_ReturnsConflictProjectCompleted()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.Completed
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            // Act
            var result = _controller.StartProject(projectId) as ConflictObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(409, result.StatusCode);
            Assert.AreEqual("Project completed", result.Value);
        }

        [Test]
        public void StartProject_ReturnsNotFoundResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(null);

            // Act
            var result = _controller.StartProject(projectId) as NotFoundObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Project not found", result.Value);
        }

        [Test]
        public void CompleteProject_ReturnsOkResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.InProgress
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            // Act
            var result = _controller.CompleteProject(projectId) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual("Project completed", result.Value);
        }

        [Test]
        public void CompleteProject_ReturnsConflictProjectNotStarted()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.New
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            // Act
            var result = _controller.CompleteProject(projectId) as ConflictObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(409, result.StatusCode);
            Assert.AreEqual("Project not started", result.Value);
        }

        [Test]
        public void CompleteProject_ReturnsConflictProjectAlreadyCompleted()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.Completed
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            // Act
            var result = _controller.CompleteProject(projectId) as ConflictObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(409, result.StatusCode);
            Assert.AreEqual("Project already completed", result.Value);
        }

        [Test]
        public void CompleteProject_ReturnsNotFoundResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(null);

            // Act
            var result = _controller.CompleteProject(projectId) as NotFoundObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Project not found", result.Value);
        }

        [Test]
        public void RegisterTime_ReturnsCreatedResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var registerTimeDTO = new RegisterTimeDTO { TimeMinutes = 45 };

            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.InProgress
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            var registeredTime = new TimeRegistration
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                RegistrationTimestamp = 1701986389,
                TimeMinutes = 45
            };

            A.CallTo(() => _context.RegisterTime(projectId, registerTimeDTO)).Returns(registeredTime);

            // Act
            var result = _controller.RegisterTime(projectId, registerTimeDTO) as CreatedResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(201, result.StatusCode);
            Assert.IsNotNull(result.Value as TimeRegistration);
        }

        [Test]
        public void RegisterTime_ReturnsBadRequestBelowLimit()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var registerTimeDTO = new RegisterTimeDTO { TimeMinutes = 15 };

            var project = new Project
            {
                Id = projectId,
                Name = "Sample Project",
                CreationDateTimestamp = 1694120389,
                DeadlineDateTimestamp = 1701986389,
                ProjectStatus = Status.InProgress
            };

            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(project);

            // Act
            var result = _controller.RegisterTime(projectId, registerTimeDTO) as ObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(406, result.StatusCode);
            Assert.AreEqual("The time registered is below the 30 mins limit", result.Value);
        }

        [Test]
        public void RegisterTime_ReturnsNotFoundResult()
        {
            // Arrange
            var projectId = new Guid("76e98817-9433-4c1d-a736-0eaaff32d70e");
            var registerTimeDTO = new RegisterTimeDTO { TimeMinutes = 45 };
            A.CallTo(() => _context.GetProjectDetails(projectId)).Returns(null);

            // Act
            var result = _controller.RegisterTime(projectId, registerTimeDTO) as NotFoundObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Project not found", result.Value);
        }
    }
}

