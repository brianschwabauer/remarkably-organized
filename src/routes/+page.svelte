<script lang="ts">
	import { page } from '$app/state';
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
		<a href="/planner{page.url.search}">Start Creating</a>
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
		background-image: linear-gradient(
			180deg,
			hsl(227deg 87% 9%) 0%,
			hsl(217deg 83% 16%) 29%,
			hsl(208deg 80% 24%) 46%,
			hsl(197deg 76% 31%) 60%,
			hsl(188deg 72% 38%) 74%,
			hsl(178deg 68% 45%) 87%,
			hsl(168deg 64% 52%) 100%
		);
		@include desktop {
			background-image: linear-gradient(
				60deg,
				hsl(227deg 87% 9%) 0%,
				hsl(217deg 83% 16%) 29%,
				hsl(208deg 80% 24%) 46%,
				hsl(197deg 76% 31%) 60%,
				hsl(188deg 72% 38%) 74%,
				hsl(178deg 68% 45%) 87%,
				hsl(168deg 64% 52%) 100%
			); // https://www.joshwcomeau.com/gradient-generator?colors=030c2c|37d3b4&angle=180&colorMode=hsl&precision=5&easingCurve=0.2413793103448276|1.0002020474137931|0.6853448275862069|0.40106411637931033
		}
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
		margin: 2rem 0 0;
		@include tablet {
			font-size: 8rem;
		}
		@include desktop {
			margin: 0;
		}
		small {
			line-height: 1;
			font-size: 1.5rem;
			color: white;
			opacity: 0.65;
			@include tablet {
				font-size: 2rem;
			}
		}
	}

	img {
		max-width: min(100%, 900px);
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
		color: white;
		opacity: 0.8;
		text-align: center;
		font-size: 1.2rem;
		margin: 1rem auto 0;
		@include tablet {
			font-size: 1.5rem;
			margin: 1rem auto 0;
		}
	}
</style>
