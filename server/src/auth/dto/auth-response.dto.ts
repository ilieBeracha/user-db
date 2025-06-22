export class SiteDto {
  id: string;
  name: string;
  domain: string;
  layout_id: string;
}

export class AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}
