<script lang="ts">
	import { page } from '$app/stores';
</script>

<main>
	<section>
		<h1>
			<small>Remarkably Organized</small>
			Planner
		</h1>
		<p>
			Create a custom planner & organizer for the e-ink tablets like the Remarkable 2.
		</p>
		<a href="/planner{$page.url.search}">Start Creating</a>
	</section>
	<section>
		<img
			src="/remarkably-organized-day-view.jpg?url"
			alt="Remarkably Organized Planner - Day View" />
	</section>
</main>

<style lang="scss">
	main {
		min-height: 100vh;
		background-color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: calc(100% - 2rem);
		max-width: 1200px;
		padding: 1rem 0 0;
		@include tablet {
			padding: 2rem 1rem;
		}
		@include desktop {
			width: 50%;
		}
	}

	h1 {
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 1;
		font-size: 5rem;
		@include tablet {
			font-size: 8rem;
		}
		small {
			line-height: 1;
			font-size: 1.5rem;
			@include tablet {
				font-size: 2rem;
			}
		}
	}

	img {
		max-width: 900px;
		max-height: 90vh;
		border-radius: 20px;
		object-fit: contain;
		box-shadow: var(--shadow-5);
	}

	a {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #eeeeee;
		color: black;
		border-radius: 999px;
		padding: 1rem 2rem;
		font-size: 1.5rem;
		&:hover {
			background-color: white;
		}
		margin: 2rem 0 0;
		@include tablet {
			margin: 3rem 0 2rem;
		}
	}
	p {
		max-width: 450px;
		color: #cccccc;
		text-align: center;
		font-size: 1.2rem;
		margin: 1rem auto 0;
		@include tablet {
			font-size: 1.5rem;
			margin: 1rem auto 0;
		}
	}
</style>
