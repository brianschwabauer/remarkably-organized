<div class="task-progress">
	<div class="header">
		<div>TASKS</div>
		<div>
			PRIORITY
			<div class="priority-labels">
				<span>H</span>
				<span>M</span>
				<span>L</span>
			</div>
		</div>
		<div>DUE & PROGRESS</div>
	</div>
	{#each new Array(25) as _, i (i)}
		<div class="row">
			<input type="text" class="task-input" />
			<div class="priority">
				<input type="checkbox" aria-label="High Priority" />
				<input type="checkbox" aria-label="Medium Priority" />
				<input type="checkbox" aria-label="Low Priority" />
			</div>
			<div class="due-progress">
				<div class="progress"></div>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.task-progress {
		display: grid;
		grid-template-rows: auto repeat(25, 1fr);
		gap: 0; /* Remove gap between rows */
		padding: 1rem;
		width: 100%;
		height: 100%;

		.header {
			display: grid;
			grid-template-columns: 3fr 1fr 1fr; /* Adjusted to give more space for tasks */
			font-weight: bold;
			text-align: center;
			padding-bottom: 0.5rem;
			border-bottom: 1px solid var(--outline);
		}

		.row {
			display: grid;
			grid-template-columns: 3fr 1fr 1fr; /* Adjusted to give more space for tasks */
			align-items: center;
			gap: 0; /* Remove gap between elements in row */
			height: 2rem; /* Condense row height */
			border-bottom: 1px solid var(--outline);

			.task-input {
				width: 100%;
				border: none;
				font-size: 1em;
				outline: none;
				padding: 0.25rem 0;
			}

			.priority {
				display: flex;
				justify-content: center;

				input[type='checkbox'] {
					margin: 0;
					transform: scale(1.2);
					cursor: pointer;
				}
			}

			.progress {
				display: flex;
				align-items: flex-end;
				width: 50px;
				height: 1rem;
				background-color: #f0f0f0;
				border-radius: 7px;
			}
			.due-progress {
				display: flex;
				justify-content: flex-end;
			}
			.progress {
				width: 33%;
				height: 1rem;
				background-color: #f0f0f0;
				border-radius: 7px;
				position: relative; /* Allows absolute positioning within */
			}
		}
	}
</style>
