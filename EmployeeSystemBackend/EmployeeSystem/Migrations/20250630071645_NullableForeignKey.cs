using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeSystem.Migrations
{
    /// <inheritdoc />
    public partial class NullableForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Logins_Employees_employeeId",
                table: "Logins");

            migrationBuilder.DropIndex(
                name: "IX_Logins_employeeId",
                table: "Logins");

            migrationBuilder.AlterColumn<int>(
                name: "employeeId",
                table: "Logins",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Logins_employeeId",
                table: "Logins",
                column: "employeeId",
                unique: true,
                filter: "[employeeId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Logins_Employees_employeeId",
                table: "Logins",
                column: "employeeId",
                principalTable: "Employees",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Logins_Employees_employeeId",
                table: "Logins");

            migrationBuilder.DropIndex(
                name: "IX_Logins_employeeId",
                table: "Logins");

            migrationBuilder.AlterColumn<int>(
                name: "employeeId",
                table: "Logins",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Logins_employeeId",
                table: "Logins",
                column: "employeeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Logins_Employees_employeeId",
                table: "Logins",
                column: "employeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
